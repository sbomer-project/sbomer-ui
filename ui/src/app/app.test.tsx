import * as React from 'react';
import App from '@app/index';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('App tests', () => {
  it('should render without crashing', () => {
    const { container } = render(<App basename="/" />);
    expect(container).toBeInTheDocument();
  });

  it('should render the header with app name', () => {
    render(<App basename="/" />);
    const appNames = screen.getAllByText('SBOMer');
    expect(appNames.length).toBeGreaterThan(0);
  });

  it('should render the main navigation', () => {
    render(<App basename="/" />);
    // Check that navigation links exist (using getAllByRole since some appear multiple times)
    const dashboardLinks = screen.getAllByRole('link', { name: 'Dashboard' });
    expect(dashboardLinks.length).toBeGreaterThan(0);

    const eventLinks = screen.getAllByRole('link', { name: 'Events' });
    expect(eventLinks.length).toBeGreaterThan(0);

    const generationLinks = screen.getAllByRole('link', { name: 'Generations' });
    expect(generationLinks.length).toBeGreaterThan(0);

    const enhancementLinks = screen.getAllByRole('link', { name: 'Enhancements' });
    expect(enhancementLinks.length).toBeGreaterThan(0);

    const helpLinks = screen.getAllByRole('link', { name: 'Help' });
    expect(helpLinks.length).toBeGreaterThan(0);
  });
});
