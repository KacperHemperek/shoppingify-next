import React from 'react';
import { Discuss } from 'react-loader-spinner';

function Loadingpage() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <Discuss
        visible={true}
        height="80"
        width="80"
        ariaLabel="comment-loading"
        colors={['#F9A109', '#F9A109']}
      />
    </div>
  );
}

export default Loadingpage;
