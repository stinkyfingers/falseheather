import React from 'react';
import parser from 'fast-xml-parser';
import '../css/music.css';

const Music = () => {
  const [tracks, setTracks] = React.useState([]);
  React.useEffect(() => {
  const t = []

  const getTracks = () => {

    return fetch('https://s3-us-west-1.amazonaws.com/tracks.john-shenk.com/')
      .then(resp => resp.text())
      .then(resp => {
        if(parser.validate(resp) === true) {
          var jsonObj = parser.parse(resp);
          for (let i = 0; i < jsonObj.ListBucketResult.Contents.length; i++) {
            const object = jsonObj.ListBucketResult.Contents[i];
            const info = object.Key.split('/');
            const item = { group: info[0], band: info[1], album: info[2], track: info[3], url: object.Key };
            if (item.band !== 'False Heather') continue;
            t.push(item);
          }
        }
      })
      .then(() => {
        setTracks(t)
      })
    };
    getTracks();
  }, []);

  const renderTracks = () => {
    const data = tracks.map(track => {
      return <tr key={track.url}><td>{track.album}</td><td><a href={`https://s3.us-west-1.amazonaws.com/tracks.john-shenk.com/${track.url}`}>{track.track}</a></td></tr>
    });
    return <table>
      <tbody>
        {data}
      </tbody>
    </table>
  }

  return (<div className='music'>
    {renderTracks()}
  </div>);
}

export default Music;
