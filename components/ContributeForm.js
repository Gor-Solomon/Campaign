import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';

class ContributeForm extends Component {
    render() {
        <Form>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input label="ether" labelPosition="right" />
            </Form.Field>
            <Button primary>
                Contribute!
            </Button>
        </Form>
    }
};

export default ContributeForm;