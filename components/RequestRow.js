import React, { Component } from 'react';
import { Button, Table, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {

    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onApprove = async () => {

        this.setState({ loading: true, errorMessage: '' });

        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();

        try {
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });

            window.location.reload();
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
        finally {
            this.setState({ loading: false });
        }

    };

    onFinalize = async () => {

        this.setState({ loading: true, errorMessage: '' });

        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();

        try {
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });

            window.location.reload();
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
        finally {
            this.setState({ loading: false });
        }

    };

    render() {
        const { Row, Cell } = Table;
        const request = this.props.request;
        const readyToFinalize = request.approvalCount > (this.props.approversCount / 2);

        return (
            <>
                <Row positive={readyToFinalize && !request.complete} disabled={request.complete} error={!!this.state.errorMessage} >
                    <Cell>{this.props.id}</Cell>
                    <Cell>{request.description}</Cell>
                    <Cell>{web3.utils.fromWei(this.props.request.value, 'ether')}</Cell>
                    <Cell>{request.recipient}</Cell>
                    <Cell>{request.approvalCount} / {this.props.approversCount}</Cell>
                    <Cell>
                        <Button color="green" disabled={request.complete || readyToFinalize} onClick={async () => await this.onApprove()} basic>Approve</Button>
                    </Cell>
                    <Cell>
                        <Button color="teal" disabled={request.complete} onClick={async () => await this.onFinalize()} basic>Finalize</Button>
                    </Cell>
                </Row>

                {this.state.errorMessage && (
                    <Row>
                        <Cell colSpan="7"> {/* adjust colSpan to match your table */}
                             <Message error content={this.state.errorMessage} />
                        </Cell>
                    </Row>
                )}
            </>
        );
    }
};

export default RequestRow;