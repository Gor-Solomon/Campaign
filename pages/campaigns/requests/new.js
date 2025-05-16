import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Message, Button, Label, Input } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

class RequestNew extends Component {
    state = {
        description: '',
        value: '',
        recipient: '',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        // Return the address as an object property, not directly
        return { address };
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ errorMessage: '', loading: true });

        try {
            const campaign = Campaign(this.props.address);
            const { description, value, recipient } = this.state;

            // Validate required fields
            if (!description || !value || !recipient) {
                throw new Error('All fields are required');
            }

            // Validate the recipient address
            if (!web3.utils.isAddress(recipient)) {
                throw new Error('Invalid recipient address format');
            }

            // Use checksummed recipient address
            const checksummedRecipient = web3.utils.toChecksumAddress(recipient);

            const accounts = await web3.eth.getAccounts();

            if (!accounts || accounts.length === 0) {
                throw new Error('No Ethereum accounts available. Please make sure MetaMask is connected.');
            }

            await campaign.methods
                .createRequest(
                    description,
                    web3.utils.toWei(value, 'ether'),
                    checksummedRecipient
                )
                .send({
                    from: accounts[0]
                });

            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            console.error('Error details:', err);
            this.setState({ errorMessage: err.message });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        return (
            <Layout>

                <h3>Create a Request</h3>

                {this.state.errorMessage && (
                    <Message error>
                        <Message.Header>Error</Message.Header>
                        <p>{this.state.errorMessage}</p>
                    </Message>
                )}

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <Label>Description</Label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                            placeholder="What is this request for?"
                        />
                    </Form.Field>

                    <Form.Field>
                        <Label>Value in Ether</Label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                            placeholder="0.01"
                            type="number"
                            step="0.000001"
                            min="0"
                        />
                    </Form.Field>

                    <Form.Field>
                        <Label>Recipient</Label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => this.setState({ recipient: event.target.value })}
                            placeholder="0x0000..."
                        />
                    </Form.Field>

                    <Button primary={true} loading={this.state.loading} disabled={this.state.loading}>
                        Create
                    </Button>
                    <Link route={`/campaigns/${this.props.address}/requests`} >
                        <a style={{ paddingLeft: 10 }}>
                            <Button > Back</Button>
                        </a>
                    </Link>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;