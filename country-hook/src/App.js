import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useField = type => {
  const [value, setValue] = useState('');

  const onChange = event => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = name => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (!name) return setCountry(null);
    const getCountry = async () => {
      let res;
      try {
        res = await axios(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
      } catch (e) {
        // console.error(e);
        setCountry({ found: false });
      }

      if (res.status === 200) setCountry({ ...res.data[0], found: true });
    };
    getCountry();
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  console.log('rendering country');
  useEffect(() => console.log(country), [country]);
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }

  return (
    <div>
      <h3>{country.name.common} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div>
      <img
        src={country.flags.png}
        height="100"
        alt={`flag of ${country.name.common}`}
      />
    </div>
  );
};

const App = () => {
  console.log('rendering');
  const nameInput = useField('text');
  const [name, setName] = useState('');
  const country = useCountry(name);

  const fetch = e => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
