import React, { useState, useEffect } from 'react';
import type {
  PersonalSettings,
  UpdatePersonalSettingsDto,
  SupportedDateFormat,
  SupportedTimeFormat,
  SupportedWeekStart,
  SupportedCalendarView,
} from '@corviin-hub/shared';

interface RegionalAndCalendarSectionProps {
  settings: PersonalSettings;
  onSave: (dto: UpdatePersonalSettingsDto) => Promise<void>;
  isSaving: boolean;
}

export const RegionalAndCalendarSection: React.FC<RegionalAndCalendarSectionProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [timezone, setTimezone] = useState(settings.timezone);
  const [dateFormat, setDateFormat] = useState<SupportedDateFormat>(settings.dateFormat);
  const [timeFormat, setTimeFormat] = useState<SupportedTimeFormat>(settings.timeFormat);
  const [weekStartDay, setWeekStartDay] = useState<SupportedWeekStart>(settings.weekStartDay);
  const [defaultCalendarView, setDefaultCalendarView] = useState<SupportedCalendarView>(
    settings.defaultCalendarView,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setTimezone(settings.timezone);
    setDateFormat(settings.dateFormat);
    setTimeFormat(settings.timeFormat);
    setWeekStartDay(settings.weekStartDay);
    setDefaultCalendarView(settings.defaultCalendarView);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    try {
      await onSave({
        timezone,
        dateFormat,
        timeFormat,
        weekStartDay,
        defaultCalendarView,
      });
      setStatusMessage('Regional and calendar preferences saved.');
    } catch {
      setStatusMessage('Failed to save regional settings.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Timezone & Calendar Preferences</h2>
        <p className="text-xs text-secondary mt-0.5">
          Configure how dates, times, and calendar views are rendered across your workspace session.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30) — Primary Operational Hub</option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">America/New_York (EST / EDT)</option>
              <option value="Europe/London">Europe/London (GMT / BST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST +04:00)</option>
            </select>
            <p className="text-[10px] text-tertiary mt-1">
              Dates on tasks, meetings, and activity logs render relative to this timezone.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value as SupportedDateFormat)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 05/11/2026) — Standard India / UK</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-11-05) — ISO 8601</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 11/05/2026) — US Format</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Time Format
            </label>
            <select
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value as SupportedTimeFormat)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            >
              <option value="12h">12-hour clock (e.g. 02:30 PM)</option>
              <option value="24h">24-hour clock (e.g. 14:30)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Week Starts On
            </label>
            <select
              value={weekStartDay}
              onChange={(e) => setWeekStartDay(e.target.value as SupportedWeekStart)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            >
              <option value="MONDAY">Monday (Standard Business Week)</option>
              <option value="SUNDAY">Sunday</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-primary mb-1">
              Default Calendar View
            </label>
            <select
              value={defaultCalendarView}
              onChange={(e) => setDefaultCalendarView(e.target.value as SupportedCalendarView)}
              className="w-full text-xs bg-surface border border-border rounded px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[38px]"
            >
              <option value="AGENDA">Agenda View (Recommended for Mobile / Daily Focus)</option>
              <option value="WEEK">Week View</option>
              <option value="MONTH">Month Grid View</option>
              <option value="DAY">Day View</option>
            </select>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded text-xs border ${
              statusMessage.includes('saved')
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border-rose-300 dark:border-rose-800'
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50 min-h-[44px]"
          >
            {isSaving ? 'Saving Changes...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

