import React from 'react';
import { render, screen } from '@testing-library/react-native';
import DegreeCard from '@/components/DegreeCard';

// Mock di MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: ({ testID, ...props }: any) => null,
}));

describe('DegreeCard', () => {
  const mockProps = {
    sign: 'Aries',
    degree: 15,
    title: 'A Test Symbol',
    keynote: 'THE KEYNOTE OF THE SYMBOL',
    description: 'This is a test description of the Sabian symbol.',
  };

  it('renders correctly with all props', () => {
    render(<DegreeCard {...mockProps} />);
    expect(screen.getByText('Aries · 15°')).toBeTruthy();
    expect(screen.getByText('A Test Symbol')).toBeTruthy();
    expect(screen.getByText('THE KEYNOTE OF THE SYMBOL')).toBeTruthy();
    expect(screen.getByText('This is a test description of the Sabian symbol.')).toBeTruthy();
  });

  it('handles long descriptions without breaking layout', () => {
    const longDescription = 'A'.repeat(500);
    render(<DegreeCard {...mockProps} description={longDescription} />);
    expect(screen.getByText(longDescription)).toBeTruthy();
  });
});