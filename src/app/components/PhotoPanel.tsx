import * as React from 'react';
import { Image, Panel } from 'react-bootstrap';

export default function PhotoPanel({header, photoUrl}: {header: string, photoUrl: string}) {
  return (<Panel bsStyle='primary' className={photoUrl ? 'text-center' : 'hidden'} header={header} collapsible defaultExpanded>
    <Image alt={header} src={photoUrl} responsive thumbnail />
  </Panel>);
}
