export const validateEmail = email => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const validateName = name => {
  return name.match(/^[a-zA-Z]+$/);
};

export const roundToCents = (amount) => {
  return Math.round(amount * 100) / 100;
}

export const shortcutAddress = (address) => {
  return address?.slice(0,5) + '...' + address?.slice(-5);
}

export const randomColor = () => {
  const hexCharacters = [0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"]
  const getCharacter = (index) => hexCharacters[index]

  let hexColorRep = "#"

	for (let index = 0; index < 6; index++){
		const randomPosition = Math.floor ( Math.random() * hexCharacters.length ) 
    	hexColorRep += getCharacter( randomPosition )
	}
	
	return hexColorRep
}