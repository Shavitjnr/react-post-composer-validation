import React, { useState } from 'react';
import { Calendar, X, AlertCircle } from 'lucide-react';

export function ScheduleModal({ isOpen, onClose, onConfirmSchedule, platform }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().slice(0, 10);

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('10:00');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledDateTime = new Date(`${date}T${time}:00`);

    if (isNaN(scheduledDateTime.getTime())) {
      setError('Please choose a valid date and time.');
      return;
    }

    if (scheduledDateTime.getTime() <= Date.now()) {
      setError('Scheduled time must be in the future.');
      return;
    }

    setError('');
    const formatted = `${date} ${time}:00`;
    onConfirmSchedule(formatted);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span className="modal-title">Schedule Post for {platform}</span>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="modal-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-field">
            <label className="field-label">Scheduled Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="modal-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">Scheduled Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="modal-input"
            />
          </div>

          <p className="schedule-hint">
            The post will be marked as <strong>Scheduled</strong> and saved to <code>data/posts.csv</code>.
          </p>

          <div className="modal-actions-row">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
