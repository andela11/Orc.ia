import { useState, useEffect, useRef, useCallback } from 'react';
import { FalsifiedDiplomaAlert, FalsifiedHashRecord } from '../types';

interface RealtimeAlertsState {
  alerts: FalsifiedDiplomaAlert[];
  blacklistedHashes: FalsifiedHashRecord[];
  isConnected: boolean;
  activeCount: number;
  latestAlert: FalsifiedDiplomaAlert | null;
  audioEnabled: boolean;
}

export function useRealtimeAlerts() {
  const [alerts, setAlerts] = useState<FalsifiedDiplomaAlert[]>([]);
  const [blacklistedHashes, setBlacklistedHashes] = useState<FalsifiedHashRecord[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latestAlert, setLatestAlert] = useState<FalsifiedDiplomaAlert | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle high-priority auditory cue using Web Audio API
  const playAlertSound = useCallback(() => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25); // Drop to A4

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }, [audioEnabled]);

  // Initial REST fetch as fallback & instant hydrate
  const fetchInitialAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAlerts(data.alerts || []);
          setBlacklistedHashes(data.blacklistedHashes || []);
        }
      }
    } catch (e) {
      console.warn('Initial alerts fetch error:', e);
    }
  }, []);

  // WebSocket Connection Lifecycle
  const connectWebSocket = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/alerts`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'init') {
            if (Array.isArray(payload.data?.alerts)) {
              setAlerts(payload.data.alerts);
            }
            if (Array.isArray(payload.data?.blacklistedHashes)) {
              setBlacklistedHashes(payload.data.blacklistedHashes);
            }
          } else if (payload.type === 'alert:created') {
            const newAlert: FalsifiedDiplomaAlert = payload.data;
            setAlerts((prev) => {
              if (prev.some((a) => a.id === newAlert.id)) return prev;
              return [newAlert, ...prev];
            });
            setLatestAlert(newAlert);
            playAlertSound();
          } else if (payload.type === 'alert:updated') {
            const updatedAlert: FalsifiedDiplomaAlert = payload.data;
            setAlerts((prev) =>
              prev.map((a) => (a.id === updatedAlert.id ? updatedAlert : a))
            );
          } else if (payload.type === 'hash:blacklisted') {
            const newHash: FalsifiedHashRecord = payload.data;
            setBlacklistedHashes((prev) => {
              const existingIdx = prev.findIndex((h) => h.sha256 === newHash.sha256);
              if (existingIdx >= 0) {
                const next = [...prev];
                next[existingIdx] = newHash;
                return next;
              }
              return [newHash, ...prev];
            });
          }
        } catch (err) {
          console.warn('WS message parse error:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Automatic reconnection every 4 seconds
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
          connectWebSocket();
        }, 4000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (err) {
      console.warn('WebSocket init error:', err);
      setIsConnected(false);
    }
  }, [playAlertSound]);

  useEffect(() => {
    fetchInitialAlerts();
    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimerRef.current);
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch {}
      }
    };
  }, [fetchInitialAlerts, connectWebSocket]);

  // Update an alert status
  const updateAlertStatus = async (
    alertId: string,
    status: FalsifiedDiplomaAlert['status'],
    note?: string,
    handledBy = 'Administrateur Sécurité'
  ) => {
    try {
      // Optimistic update
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? {
                ...a,
                status,
                handledBy,
                handledAt: new Date().toISOString(),
                investigationNotes: note
                  ? [...(a.investigationNotes || []), `[${new Date().toLocaleTimeString('fr-FR')}] ${note}`]
                  : a.investigationNotes,
              }
            : a
        )
      );

      // Send via HTTP PATCH
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, handledBy }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.alert) {
          setAlerts((prev) => prev.map((a) => (a.id === alertId ? data.alert : a)));
        }
      }
    } catch (err) {
      console.error('Failed to update alert:', err);
    }
  };

  // Quick Acknowledge
  const acknowledgeAlert = async (alertId: string, handledBy = 'Administrateur Sécurité') => {
    await updateAlertStatus(alertId, 'ACQUITTEE', 'Alerte examinée et acquittée par l’administrateur.', handledBy);
  };

  // Add Hash to Blacklist
  const addBlacklistedHash = async (record: {
    sha256: string;
    reason: string;
    studentName?: string;
    institution?: string;
    degreeTitle?: string;
    threatLevel?: 'MAXIMAL' | 'ELEVE' | 'MODERE';
    notes?: string;
  }) => {
    try {
      const res = await fetch('/api/alerts/blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de l’ajout du hash');
      }
      const data = await res.json();
      if (data.record) {
        setBlacklistedHashes((prev) => [data.record, ...prev.filter((h) => h.sha256 !== data.record.sha256)]);
      }
      return data.record;
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’enregistrement');
      throw err;
    }
  };

  // Remove Hash from Blacklist
  const removeBlacklistedHash = async (sha256: string) => {
    try {
      const res = await fetch(`/api/alerts/blacklist/${encodeURIComponent(sha256)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBlacklistedHashes((prev) => prev.filter((h) => h.sha256 !== sha256));
      }
    } catch (err) {
      console.error('Failed to remove hash from blacklist:', err);
    }
  };

  // Trigger simulated test alert
  const simulateAlert = async () => {
    try {
      const res = await fetch('/api/alerts/simulate', { method: 'POST' });
      const data = await res.json();
      if (data.alert) {
        setAlerts((prev) => {
          if (prev.some((a) => a.id === data.alert.id)) return prev;
          return [data.alert, ...prev];
        });
        setLatestAlert(data.alert);
        playAlertSound();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  const dismissToast = () => setLatestAlert(null);

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  return {
    alerts,
    blacklistedHashes,
    isConnected,
    activeCount,
    latestAlert,
    audioEnabled,
    setAudioEnabled,
    dismissToast,
    updateAlertStatus,
    acknowledgeAlert,
    addBlacklistedHash,
    removeBlacklistedHash,
    simulateAlert,
    refresh: fetchInitialAlerts,
  };
}
