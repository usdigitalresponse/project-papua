import React, {Component} from 'react';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import './App.css';
import FormApp from './components/FormApp'
import { withAuthenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';

Amplify.configure(awsconfig);

class App extends Component {
    render() {
        return (
            <div className="App">
                <FormApp/>
            </div>
        );
    }

}
export default withAuthenticator(App, true);