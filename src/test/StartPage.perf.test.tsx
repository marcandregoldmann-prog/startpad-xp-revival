
import { describe, it, expect, beforeEach, mock, afterEach } from 'bun:test';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Mock the dependencies
mock.module('@/lib/tasks', () => {
    return {
        loadTasks: mock(() => []),
        loadCompletions: mock(() => []),
        getTodaysTasks: mock(() => []),
        isTaskCompletedToday: mock(() => false),
        checkStreakReset: mock(() => ({})),
        getTodaysXP: mock(() => 0),
    }
});

mock.module('@/lib/wissen', () => ({
  loadWissen: mock(() => []),
  getRunningMedia: mock(() => []),
}));

mock.module('@/lib/focus', () => ({
  loadWochenfokus: mock(() => ''),
  getKontextHinweise: mock(() => []),
}));

// Import after mocking
import StartPage from '../pages/StartPage';
import { loadTasks } from '@/lib/tasks';

describe('StartPage Performance Baseline', () => {

  beforeEach(() => {
    GlobalRegistrator.register();
    document.body.innerHTML = '';
    (loadTasks as any).mockClear();
  });

    afterEach(() => {
        GlobalRegistrator.unregister();
    })

  it('avoids unnecessary loadTasks calls on simple interactions (like toggling Edit)', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <StartPage />
      </BrowserRouter>
    );

    // Initial render
    expect(loadTasks).toHaveBeenCalledTimes(1);

    // Simulate clicking "Bearbeiten" button to toggle edit mode
    // This causes a re-render of StartPage because state `editLinks` changes
    const editButton = getByText('Bearbeiten');
    fireEvent.click(editButton);

    // With optimization, this should NOT trigger another loadTasks call
    // We expect 1 call total (1 initial + 0 re-render)
    expect(loadTasks).toHaveBeenCalledTimes(1);
  });
});
