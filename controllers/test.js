module.exports = {
	tests: async (req, res) => {
		try{
			
            res.send("I'm Alive!");

		}catch(error){
			console.log(`Test ERROR: ${error}`);
			return res.send('Error in Test');
		}
	}
}