const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);
  };
  
  const kelvinToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);
  };
  
  module.exports = { kelvinToCelsius, kelvinToFahrenheit };
  