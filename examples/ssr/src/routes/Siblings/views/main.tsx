import * as React from 'react'
import SFCWithHook from '../components/SFCWithHook'

const SiblingsMainView: React.SFC = () => {
  return (
    <>
      <SFCWithHook id={1} />
      <SFCWithHook id={1} />
      <SFCWithHook id={1} raw />
      <SFCWithHook id={2} />
      <SFCWithHook id={3} />
    </>
  );
};

export default SiblingsMainView;
