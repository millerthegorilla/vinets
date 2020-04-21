import React from 'react';
import { render } from '@testing-library/react';
import Garden from '../Garden';

test('garden renders ok', () => {
	var garden = new Garden(); 
	render(garden.render());
	expect(garden.lawn.current).toBeInTheDocument();
});