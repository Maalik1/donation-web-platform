/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import { Breadcrumb, Button, ButtonGroup, Grid, PageHeader } from 'react-bootstrap';
import { connect } from 'react-redux';
import { IDispatch } from '~react-redux~redux';
import { bindActionCreators } from 'redux';

import { fetchAllDonations } from '../actions/index';
import FoodDonationsPanel from '../components/FoodDonationsPanel';
import NonfoodDonationsPanel from '../components/NonfoodDonationsPanel';

import IFoodDonation from '../types/IFoodDonation';
import INonfoodDonation from '../types/INonfoodDonation';
import UserRole from '../types/UserRole';

interface IDonationsProps {
  actions: any;
  foodDonations: IFoodDonation[];
  nonfoodDonations: INonfoodDonation[];
}

interface IDonationsState { }

class Donations extends React.Component<IDonationsProps, IDonationsState> {
  static contextTypes = { currentId: React.PropTypes.string, currentRole: React.PropTypes.string };

  context: { currentId: string, currentRole: UserRole };

  componentWillMount() {
    this.props.actions.fetchAllDonations();
  }

  render() {
    const {currentId, currentRole} = this.context;
    const {actions, foodDonations, nonfoodDonations} = this.props;

    return (<section>
      <PageHeader className='text-center'>التبرعات</PageHeader>

      <Grid>
        <Breadcrumb dir='rtl'>
          <Breadcrumb.Item href='#/'>الصفحة الرئيسية</Breadcrumb.Item>
          <Breadcrumb.Item active>التبرعات</Breadcrumb.Item>
        </Breadcrumb>

        <FoodDonationsPanel currentId={currentId} donations={foodDonations} onUpdate={actions.fetchAllDonations} />
        <NonfoodDonationsPanel currentId={currentId} donations={nonfoodDonations} onUpdate={actions.fetchAllDonations} />
      </Grid>

      <Grid className={currentRole === 'charity' ? 'hidden' : 'text-center'}>
        <ButtonGroup bsSize='lg' justified>
          <Button bsStyle='success' href='#/donations/donate/nonfood'>تبرع بشيء آخر</Button>
          <Button bsStyle='success' href='#/donations/donate/food'>تبرع بطعام</Button>
        </ButtonGroup>
      </Grid>
    </section>);
  }
}

function mapStateToProps({donations}: any) {
  return donations;
}

function mapDispatchToProps(dispatch: IDispatch) {
  return { actions: bindActionCreators({ fetchAllDonations }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Donations);
