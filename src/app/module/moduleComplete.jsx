import TextBox from "./textbox.jsx";
import QuizBox from "./quizbox.jsx";

export default function ModComplete({ setModDone }) {
  return (
    <div
      style={{
        position: 'absolute',
        height: '126.5vh',
        width: '99.2vw',
        backgroundColor: 'rgba(69, 109, 166, 0.7)',
        zIndex: 162,
        display: 'flex',
        //alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '3.125rem 1.25rem', // 50px 20px
          position: 'absolute',
          zIndex: 163,
          marginTop: '.25rem',
        }}
      >
        {/* Main Card */}
        <div
          style={{
            width: '37.5rem', // 600px
            backgroundColor: '#ffffff',
            border: '0.9375rem solid #1f3a60', // 15px
            borderRadius: '1.875rem', // 30px
            padding: '2.5rem 1.25rem', // 40px 20px
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem', // 20px
            boxShadow: '0 0.25rem 5rem rgba(0, 225, 255, 0.64)', // 0 4px 80px
          }}
        >
          <div
            style={{
              backgroundColor: '#00bfff',
              width: '100%',
              textAlign: 'center',
              padding: '1.25rem', // 20px
              color: '#fff',
              fontSize: '2.5rem', // 40px
              fontWeight: 'bold',
              boxShadow: '0 0.25rem 5rem rgba(0, 0, 0, 0.26)', // 0 4px 80px
            }}
          >
            Well Done
          </div>

          <h2 style={{ fontSize: '2.1875rem', color: '#1f3a60', marginBottom: 0 }}>
            You Have Completed
          </h2>

          <h2 style={{ fontSize: '2.1875rem', fontWeight: 'bold', color: '#1f3a60', margin: 0 }}>
            Income Statements
          </h2>

          <div
            style={{
              height: '0.25rem', // 4px
              width: '80%',
              backgroundColor: '#1f3a60',
              borderRadius: '0.125rem', // 2px
            }}
          />

          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f3a60', margin: 0 }}>
            Completed in 5 Minutes
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f3a60', margin: 0 }}>
            85% Accuracy
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: '1.875rem', // 30px
            }}
          >
            <button
              onClick={() => setModDone(false)}
              style={{
                height: '3.75rem', // 60px
                width: '45%',
                backgroundColor: '#456da6',
                borderRadius: '1.875rem', // 30px
                border: 'none',
                color: '#fff',
                fontSize: '1.25rem', // 20px
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 0.25rem 5rem rgba(0, 0, 0, 0.26)',
              }}
            >
              Back
            </button>

            <button
              style={{
                height: '3.75rem', // 60px
                width: '45%',
                backgroundColor: '#00bfff',
                borderRadius: '1.875rem', // 30px
                border: 'none',
                color: '#fff',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 0.25rem 5rem rgba(0, 0, 0, 0.26)',
              }}
            >
              Modules
            </button>
          </div>
        </div>

        {/* Feedback box */}
        <div
          style={{
            height: '4.6875rem', // 75px
            width: '30.625rem', // 490px
            backgroundColor: '#1f3a60',
            borderRadius: '1.875rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5625rem', // 25px
            zIndex: 10,
            fontWeight: 'bold',
            marginTop: '1.875rem', // 30px
            boxShadow: '0 0.25rem 5rem rgba(0, 225, 255, 0.64)',
          }}
        >
          <input
            type="text"
            placeholder="   This doesn't work rn"
            style={{
              position: 'absolute',
              height: '3rem', // 48px
              width: '22.5rem', // 360px
              backgroundColor: '#ffffff',
              borderRadius: '1.875rem 0 0 1.875rem',
              display: 'flex',
              flexDirection: 'row',
              zIndex: 11,
              marginRight: '5.9375rem', // 95px
              border: 'none',
            }}
          />

          <button
            style={{
              position: 'absolute',
              height: '3.125rem', // 50px
              width: '6.25rem', // 100px
              backgroundColor: '#00bfff',
              borderRadius: '0 1.875rem 1.875rem 0',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5625rem', // 25px
              zIndex: 11,
              color: '#ffffff',
              fontWeight: 'bold',
              marginLeft: '23.125rem', // 370px
              border: 'none',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
