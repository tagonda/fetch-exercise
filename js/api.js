// Random Pokémon component
function randomPokemon() {
    return {
        pokemon: null,
        loading: false,

        async fetchRandomPokemon() {
            this.loading = true;
            try {
                const randomId = Math.floor(Math.random() * 898) + 1; // There are ~898 Pokémon
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                const data = await response.json();
                
                this.pokemon = {
                    name: data.name,
                    height: data.height,
                    weight: data.weight,
                    image: data.sprites.other['official-artwork'].front_default,
                    types: data.types.map(t => t.type.name)
                };
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
            } finally {
                this.loading = false;
            }
        }
    };
}

// Pokémon Species component
function pokemonSpecies() {
    return {
        speciesName: '',
        species: null,
        error: null,
        loading: false,

        async fetchSpecies() {
            if (!this.speciesName.trim()) return;
            
            this.loading = true;
            this.error = null;
            
            try {
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon-species/${this.speciesName.toLowerCase()}`
                );
                
                if (!response.ok) {
                    throw new Error('Pokémon not found');
                }
                
                const data = await response.json();
                const description = data.flavor_text_entries
                    .find(entry => entry.language.name === 'en')?.flavor_text || 'No description available';
                
                this.species = {
                    name: data.name,
                    color: data.color.name,
                    habitat: data.habitat?.name,
                    description: description.replace(/\f/g, ' ')
                };
            } catch (error) {
                this.error = error.message;
                this.species = null;
            } finally {
                this.loading = false;
            }
        }
    };
}