import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Worker from '../src/test/helpers/workerMock'

configure({ adapter: new Adapter() });
window.Worker = Worker;
global.URL.createObjectURL = jest.fn();