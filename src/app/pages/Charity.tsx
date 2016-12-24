/// <reference path="../../../typings/index.d.ts" />

import firebase from 'firebase';
import * as React from 'react';
import { Breadcrumb, Grid, PageHeader, Panel, Table } from 'react-bootstrap';
import reactMixin from 'react-mixin';
import { connect } from 'react-redux';
import { IDispatch } from '~react-redux~redux';
import { hashHistory } from 'react-router';
import ReactFireMixin from 'reactfire';
import { bindActionCreators } from 'redux';

import { fetchActivity } from '../actions/index';
import ActivityPanel from '../components/ActivityPanel';
import EmailLink from '../components/EmailLink';
import IActivity from '../types/IActivity';
import ICharity from '../types/ICharity';
import PhoneLink from '../components/PhoneLink';
import PhotoPanel from '../components/PhotoPanel';
import t from '../translate';

interface ICharityProps {
  readonly actions: any;
  readonly activity: IActivity[];
  readonly params: { id: string };
}

interface ICharityState {
  readonly charity: ICharity;
}

class Charity extends React.Component<ICharityProps, ICharityState> {
  private bindAsObject: Function;

  constructor(props: any, context: any) {
    super(props, context);
    this.state = { charity: {} as ICharity };
  }

  componentDidMount() {
    const {id} = this.props.params;
    this.bindAsObject(firebase.database().ref(`charities/${id}`), 'charity', (error: Error) => {
      console.log(error);
    });
  }

  componentWillMount() {
    const {actions, params} = this.props;
    actions.fetchActivity('charity', params.id);
  }

  render() {
    const {activity} = this.props;
    const {charity} = this.state;

    // hack
    if (charity['.value'] === null) {
      hashHistory.push('/404');
      return null;
    }

    return (<section>
      <PageHeader className='text-center'>صفحة جمعية</PageHeader>

      <Grid>
        <Breadcrumb dir='rtl'>
          <Breadcrumb.Item href='#/'>الصفحة الرئيسية</Breadcrumb.Item>
          <Breadcrumb.Item href='#/charities'>الجمعيات</Breadcrumb.Item>
          <Breadcrumb.Item active>صفحة جمعية</Breadcrumb.Item>
        </Breadcrumb>

        <Panel header='بيانات الجمعية' footer={charity.description}
          bsStyle='primary' className='text-center' collapsible defaultExpanded>
          <Table fill>
            <tbody dir='rtl'>
              <tr>
                <th className='text-center'>الاسم</th>
                <td className='text-center'>{charity.name}</td>
              </tr>
              <tr>
                <th className='text-center'>الموقع</th>
                <td className='text-center'>{t(charity.location)}</td>
              </tr>
              <tr>
                <th className='text-center'>الجوال/الواتساب</th>
                <td className='text-center'><PhoneLink phone={charity.phone} /></td>
              </tr>
              <tr>
                <th className='text-center'>الإيميل</th>
                <td className='text-center'><EmailLink email={charity.email} /></td>
              </tr>
              <tr className={charity.website ? '' : 'hidden'}>
                <th className='text-center'>الموقع الرسمي</th>
                <td className='text-center'><a dir='ltr' href={charity.website} target='_blank'>{charity.website}</a></td>
              </tr>
            </tbody>
          </Table>
        </Panel>

        <PhotoPanel header='شعار الجمعية' photoUrl={charity.photoUrl} />
        <ActivityPanel activity={activity} />
      </Grid>
    </section>);
  }
}

reactMixin(Charity.prototype, ReactFireMixin);

function mapStateToProps({activity}: any) {
  return activity;
}

function mapDispatchToProps(dispatch: IDispatch) {
  return { actions: bindActionCreators({ fetchActivity }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Charity);
