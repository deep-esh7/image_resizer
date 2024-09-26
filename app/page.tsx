import ImageResizerForm from './components/ImageResizerForm';

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    margin: 0,
  },
};

export default function ImageResizerPage() {
  return (
    <div style={styles.body}>
      <ImageResizerForm />
    </div>
  );
}