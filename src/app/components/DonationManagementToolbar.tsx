/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import {Button, ButtonGroup, DropdownButton, MenuItem} from 'react-bootstrap';
import {hashHistory} from 'react-router';

import * as database from '../database';

interface IDonationManagementToolbarProps {
  currentUserId: string;
  deleteDonation: Function;
  donationId: string;
  donorId: string;
  onUpdate: Function;
  reservation: any;
}

interface IDonationManagementToolbarState {}

export default class DonationManagementToolbar extends React.Component<IDonationManagementToolbarProps, IDonationManagementToolbarState> {
  static defaultProps = {
    onUpdate: () => hashHistory.push('/donations')
  };

  static propTypes = {
    currentUserId: React.PropTypes.string.isRequired,
    deleteDonation: React.PropTypes.func.isRequired,
    donationId: React.PropTypes.string.isRequired,
    donorId: React.PropTypes.string.isRequired,
    onUpdate: React.PropTypes.func,
    reservation: React.PropTypes.object.isRequired
  };

  render() {
    const {currentUserId, deleteDonation, donationId, donorId, onUpdate, reservation} = this.props;

    return (
      <section>
        <ButtonGroup className={this.getReserveClass(currentUserId, reservation.reserverId, reservation.deliveredOrReceived)}>
          <Button bsStyle='danger' onClick={deleteDonation.bind(null, donationId)} disabled={currentUserId !== donorId}>حذف</Button>
          <DropdownButton bsStyle='success' dir='rtl' id='reserveDonationButton' title={this.getReserveTitle(reservation.reserverId)} disabled={!!reservation.reserverId || !!!currentUserId} dropup pullRight>
            <MenuItem className='text-right' eventKey='1' onClick={this.reserveDonation.bind(this, donationId, 'receiving', currentUserId, onUpdate)}>لاستقبال التبرع</MenuItem>
            <MenuItem className='text-right' eventKey='2' onClick={this.reserveDonation.bind(this, donationId, 'delivery', currentUserId, onUpdate)}>لتوصيل التبرع</MenuItem>
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup className={this.getCancelClass(currentUserId, reservation.reserverId, reservation.deliveredOrReceived)}>
          <Button bsStyle='danger' onClick={this.cancelReservation.bind(null, donationId, onUpdate)}>إلغاء الحجز</Button>
          <Button bsStyle='success' onClick={this.reportDonation.bind(null, donationId, onUpdate)}>{this.getCancelTitle(reservation.reservationType)}</Button>
        </ButtonGroup>
        <Button bsStyle='success' className={reservation.deliveredOrReceived ? '' : 'hidden'} block disabled>{this.getCancelTitle(reservation.reservationType)}</Button>
      </section>
    );
  }

  private cancelReservation(donationId: string, onUpdate: Function) {
    database.cancelReservation(donationId).then(onUpdate);
  }

  private reportDonation(donationId: string, onUpdate: Function) {
    database.reportDonation(donationId).then(onUpdate);
  }

  private reserveDonation(donationId: string, reservationType: string, currentUserId: string, onUpdate: Function) {
    database.reserveDonation(donationId, reservationType, currentUserId).then(onUpdate);
  }

  private getCancelTitle(reservationType: string) {
    if (reservationType === 'delivery') {
      return 'تم التوصيل';
    } else {
      return 'تم الاستلام';
    }
  }

  private getReserveTitle(reserverId: string) {
    if (reserverId) {
      return 'محجوز';
    } else {
      return 'حجز';
    }
  }

  private getReserveClass(currentUserId: string, reserverId: string, deliveredOrReceived: boolean) {
    if (deliveredOrReceived) {
      return 'hidden';
    } else {
      return (currentUserId && currentUserId === reserverId) ? 'hidden' : '';
    }
  }

  private getCancelClass(currentUserId: string, reserverId: string, deliveredOrReceived: boolean) {
    if (deliveredOrReceived) {
      return 'hidden';
    } else {
      const reserveClass = this.getReserveClass(currentUserId, reserverId, deliveredOrReceived);
      return (reserveClass === 'hidden') ? '' : 'hidden';
    }
  }
}
