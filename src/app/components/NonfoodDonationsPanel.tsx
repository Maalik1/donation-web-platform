/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import { Button, ButtonGroup, Panel, Table } from 'react-bootstrap';

import * as database from '../database';
import * as helpers from '../helpers';
import INonfoodDonation from '../types/INonfoodDonation';
import t from '../translate';

interface INonfoodDonationsPanelProps {
  currentId: string;
  donations: INonfoodDonation[];
  onUpdate: () => any;
}

interface INonfoodDonationsPanelState { }

export default class NonfoodDonationsPanel extends React.Component<INonfoodDonationsPanelProps, INonfoodDonationsPanelState> {
  static defaultProps = { donations: [] };

  static propTypes = {
    currentId: React.PropTypes.string.isRequired,
    donations: React.PropTypes.array.isRequired,
    onUpdate: React.PropTypes.func.isRequired
  };

  render() {
    const {donations} = this.props;
    const NonfoodDonations = donations.map(this.mapDonation.bind(this));

    return (<Panel header='تبرعات أخرى' bsStyle='primary' className='text-center' collapsible defaultExpanded>
      <Table dir='rtl' bordered condensed fill hover responsive>
        <thead>
          <tr>
            <th className='text-center'>النوع</th>
            <th className='text-center'>حالة التبرع</th>
            <th className='text-center'>الموقع</th>
            <th className='text-center'>إدارة</th>
          </tr>
        </thead>
        <tbody>
          {NonfoodDonations}
        </tbody>
      </Table>
    </Panel>);
  }

  private deleteDonation(donationId: string) {
    const {onUpdate} = this.props;
    database.removeDonation('nonfood', donationId).then(onUpdate);
  }

  private mapDonation(donation: INonfoodDonation) {
    const {currentId} = this.props;

    return (<tr className={helpers.getDonationRowClass(currentId, donation.deliveredOrReceived, donation.reserverId)}
      key={donation['.key']}>
      <td className='text-center'>{t(donation.type)}</td>
      <td className='text-center'>{t(donation.state)}</td>
      <td className='text-center'>{t(donation.location)}</td>
      <td className='text-center'>
        <ButtonGroup bsSize='xs'>
          <Button bsStyle='danger' onClick={this.deleteDonation.bind(this, donation['.key'])} disabled={currentId !== donation.donorId}>حذف</Button>
          <Button bsStyle='success' href={`#/donations/nonfood/${donation['.key']}`}>تفاصيل أكثر</Button>
        </ButtonGroup>
      </td>
    </tr>);
  }
}
