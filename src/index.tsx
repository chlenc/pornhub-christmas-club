import * as React from 'react';
import { render } from 'react-dom';

import { Provider as MobxProvider } from 'mobx-react';

import { RootStore } from '@stores';

import App from '@components/App';

const mobXStore = new RootStore();

render(<MobxProvider {...mobXStore}><App/></MobxProvider>, document.getElementById('root'));
