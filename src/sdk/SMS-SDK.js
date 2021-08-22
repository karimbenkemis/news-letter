
exports.sendSMS = async function (ListOfPhones, message, clientToken) {
    console.log(`${clientToken} sended sms list:`);

    const sendMsg = (phone, message) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                    if(parseFloat(phone)) {
                        let msgToSend = message + phone + '!';
                        console.log(msgToSend);
                        resolve(msgToSend);
                    } else {
                        reject('wrong phone number: ' + phone);
                    }
                }, 200);
        }); 
    }

    let position = 0;
    let results = [];
    let batchSize = 10;
    while (position < ListOfPhones.length) {
        let itemsForBatch = ListOfPhones.slice(position, position + batchSize);
        await Promise.all(itemsForBatch.map(item => sendMsg(item, message)))
                .then(messages => {
                    results.push(...messages);
                })
                .catch(e => {
                    console.log('unexpected error while sending messages: ' + e);
                });
        position += batchSize;
    }
    console.log(results);
    return results;
}