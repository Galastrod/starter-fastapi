	'use strict';

const app = new Vue({
	el: '.app',
	
	data: 
	{
		book_list_title: undefined,
		books_list: undefined,
		search_string: undefined
	},
	
	template:
	`
		<div class="app container">
			<div class="b-search">
				<h2>Введите название книги...</h2>
				<div class="b-search-inp">
					<input class="search__inp" placeholder="Введите название книги.." v-model="search_string">
					<button class="search__btn" @click="search">Искать</button>
				</div>
				
				<div class="b-books-list">
					<h2>{{book_list_title}}</h2>
					<div v-for="book in books_list">
						<h3>{{ book.title }}</h3>
					</div>
				</div
			</div>
		</div>
	`,
	
	methods: 
	{
		search()
		{
			console.log( this.search_string );
		}
	},
	
	created()
	{
		fetch('./new')
			.then( res => res.json() )
			.then( res => 
			{
				if( res.error )
				{
					console.error( res );
					return false
				};
				this.book_list_title = "Новые книжули..."
				this.books_list = res.books
			} );
	}
});
