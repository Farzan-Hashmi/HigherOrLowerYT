const Videos = (props) => {
  const url = String(props.videoid);
  let link = `https://www.youtube.com/embed/${url}`;
  return (
    <iframe
      src={link}
      frameBorder="0"
      allow="autoplay"
      allowFullScreen
      title="video"
      width="90%"
      height="100%"
    />
  );
};

export default Videos;
