import { render, fireEvent } from '@testing-library/svelte';

import Comp from './Comp.svelte';

test('shows proper heading when rendered', () => {
	const { getByText } = render(Comp, { name: 'World' });

	expect(getByText('Hello World!')).toBeInTheDocument();
});
