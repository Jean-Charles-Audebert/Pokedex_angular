import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-search-pokemon',
  templateUrl: './search-pokemon.component.html',
 
})
export class SearchPokemonComponent implements OnInit{

  searchTerms = new Subject<string>(); //Subject est une classe de rxjs qui stocke les recherches successives dans un tableau ==> flux de recherches. c'est comme un observable mais qu'on peut construire, pas seulement observer
  pokemons$: Observable<Pokemon[]>; //Pour chaque terme de recherche, on stocke la liste des résultats dans un tableau

  constructor(
    private router: Router,
    private pokemonService: PokemonService
    ) { }

  ngOnInit(): void {
    this.pokemons$ = this.searchTerms.pipe(
      // {..."a"."ab"."abz"..."ab".."abc"...} on veut attendre un certain temps avant d'envoyer la requête
      debounceTime(300),
      // {..."ab"...."ab"..."abc"...} on veut ne pas envoyer deux fois la même donnée
      distinctUntilChanged(),
      // {..."ab"..."abc"...} effectuer la requete
      // on veut le flux de résultat, pas le flux de recherches.
      // concatMap, mergeMap, SwitchMap possibles
      switchMap((term)=>this.pokemonService.searchPokemonList(term))
      // {...pokemonList(ab)...pokemonList(abs)...}

    );
  }

  search(term: string) {
    this.searchTerms.next(term); //on "push" le terme dans le flux de données searchTerms

  }

  goToDetail(pokemon: Pokemon) {
    const link = ['/pokemon', pokemon.id];
    this.router.navigate(link);
  }

}
