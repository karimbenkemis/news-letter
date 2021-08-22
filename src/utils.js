exports.BuildPhoneNumber = (phoneNumber) => {
    console.log(
        phoneNumber.split(' ')
            .map(x => { return parseInt(x, 10); })
            .sort()
            .reverse()
            .join('')
    );
}