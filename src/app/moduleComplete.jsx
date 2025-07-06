import TextBox from "./textbox.jsx";
import QuizBox from "./quizbox.jsx";

export default function ModComplete({setModDone}) {
  return (
    <div
          style={{
            position: 'absolute',
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(69, 109, 166, 0.7)',
            zIndex: '162',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
      }}
    >


    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px 20px',
        position: 'absolute',
        zIndex: '163',
      }}
    >
      {/* Main Card */}
      <div
        style={{
          width: '600px',
          backgroundColor: '#ffffff',
          border: '15px solid #1f3a60',
          borderRadius: '30px',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 4px 80px rgba(0, 225, 255, 0.64)',
        }}
      >
        <div
          style={{
            backgroundColor: '#00bfff',
            width: '100%',
            textAlign: 'center',
            padding: '20px',
            color: '#fff',
            fontSize: '40px',
            fontWeight: 'bold',
            boxShadow: '0 4px 80px rgba(0, 0, 0, 0.26)',
          }}
        >
          Well Done
        </div>

        <h2 style={{ fontSize: '35px', color: '#1f3a60', marginBottom: '0', }}>
          You Have Completed
        </h2>

        <h2 style={{ fontSize: '35px', fontWeight: 'bold', color: '#1f3a60', margin: 0 }}>
          Income Statements
        </h2>

        <div
          style={{
            height: '4px',
            width: '80%',
            backgroundColor: '#1f3a60',
            borderRadius: '2px',
          }}
        />

        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f3a60', margin: 0 }}>
          Completed in 5 Minutes
        </p>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f3a60', margin: 0 }}>
          85% Accuracy
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '30px',
          }}
        >
          <button
            onClick={() => setModDone(false)}
            style={{
              height: '60px',
              width: '45%',
              backgroundColor: '#456da6',
              borderRadius: '30px',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 80px rgba(0, 0, 0, 0.26)',
            }}
          >
            Back
          </button>

          <button
            //onClick= route to modules}
            style={{
              height: '60px',
              width: '45%',
              backgroundColor: '#00bfff',
              borderRadius: '30px',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 80px rgba(0, 0, 0, 0.26)',
            }}
          >
            Modules
          </button>
        </div>
      </div>

      {/* Feedback box */}
    <div
    style={{
    height: '75px',
    width: '490px',
    backgroundColor: '#1f3a60',
    borderRadius: '30px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    zIndex: '10',
    fontWeight: 'bold',
    marginTop: '30px',
    boxShadow: '0 4px 80px rgba(0, 225, 255, 0.64)',
}}
>

<input
type="text" placeholder="   Enter Feedback Here!"
    style={{
    position: 'absolute',
    height: '48px',
    width: '360px',
    backgroundColor: '#ffffff',
    borderRadius: '30px 0px 0px 30px ',
    display: 'flex',
    flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'center',
    zIndex: '11',
    marginRight: '95px',
    border: 'none',
    

}}
>



</input>

    <button
    style={{
    position: 'absolute',
    height: '50px',
    width: '100px',
    backgroundColor: '#00bfff',
    borderRadius: '0px 30px 30px 0px ',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    zIndex: '11',
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: '370px',
    border: 'none',

}}
>Send</button>

</div>
    </div>


    </div>

  );
}
