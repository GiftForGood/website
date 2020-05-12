const styles = {
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
};

const Avatar = ({ imageUrl }) => {
  return (
    <div style={{ float: 'left' }}>
      <img style={styles.avatar} src={imageUrl} />
    </div>
  );
};

export default Avatar;
