import react, { Component } from "react";
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from "../../ethereum/web3";
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummery().call();
        console.log(summary);
        return {
            address: props.query.address.toString(),
            minimumContribution: summary[0].toString(),
            balance: summary[1].toString(),
            requestsCount: summary[2].toString(),
            approversCount: summary[3].toString(),
            manager: summary[4].toString()
        };
    };

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'The manager created this campaign and can create a request',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to be able to become an approver',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to wirthdraw money from the contract. Requests must be approved by approvers',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have already donated to the campaign',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The Balance is how much money this campaign has left to spend.',
                style: { overflowWrap: 'break-word' }
            }
        ];

        return <Card.Group items={items} />;
    };

    render() {
        return (
            <Layout>
                <h1>Campaign Show!</h1>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}

                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests/`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
};

export default CampaignShow;