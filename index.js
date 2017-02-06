var BME280 = require('node-bme280');
var MilkCocoa = require('milkcocoa');
var milkcocoa = new MilkCocoa('your milkcocoa');
var barometer = new BME280({address: 0x76});
var rp = require('request-promise');

barometer.begin(function(err) {
    if (err) {
        console.info('error initializing barometer', err);
        return;
    }

    console.info('barometer running');

    setInterval(function() {
        barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
            //console.info(
            //    'temp:',
            //    temperature.toFixed(2),
            //    '℃  pressure:',
            //    (pressure / 100).toFixed(2),
            //    'hPa  hum:',
            //    humidity.toFixed(2),
            //    '%'
            //);
            milkcocoa.dataStore('data').push({
                'temperature': temperature.toFixed(2),
                'humidity': humidity.toFixed(2),
                'pressure': (pressure / 100).toFixed(2)
            });
        });
    }, 1000 * 60 * 5);

    setInterval(function() {
        barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {

            var options = {
                method: 'POST',
                uri: 'your slack webhook',
                body: {
                    text: '現在の室温は' + temperature.toFixed(2) + '度です。\n' + '現在の湿度は' + humidity.toFixed(2) + '%です。'
                },
                json: true
            };

            rp(options)
            .then()
            .catch(function(err) {
                console.log(err);
            });

        });
    }, 1000 * 60 * 60);
});

