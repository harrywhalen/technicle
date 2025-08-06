import Spreadsheet from "./spreadsheet.jsx";
import Button from "./button.jsx";
export default function Container() {
    return (
      <div
      style={{
      height: '100rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3rem',
      marginTop: '5rem'
      }}
      >
        <Spreadsheet/>
        <Button/>
      </div>
    );
  }