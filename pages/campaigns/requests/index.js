import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Card, Grid, Button } from 'semantic-ui-react';
import { Link } from '../../../routes';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        // Return an object with address property, not just the address string
        return { address };
    }

    render() {
        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary={true}>Add Request</Button>
                    </a>
                </Link>
            </Layout>
        );
    }
}

export default RequestIndex;