import { hello as helloService } from '@hike/services';
import { hello as helloTypes } from '@hike/types';
import { hello as helloUI } from '@hike/ui';
import { hello as helloUtils } from '@hike/utils';

export default function Home() {
  return (
    <p className="abc mb-5 mt-5 p-2">
      {helloService()}
      <br />
      {helloTypes()}
      <br />
      {helloUtils()}
      <br />
      {helloUI()}
    </p>
  );
}
