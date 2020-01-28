import * as React from 'react'
import SFCWithHook from '../components/SFCWithHook'

const SiblingsMainView: React.SFC = () => {
  return (
    <>
      <SFCWithHook id={1} />
      <SFCWithHook id={2} />
      <SFCWithHook id={3} />
      <SFCWithHook id={1} />
    </>
  );
};

export default SiblingsMainView;
