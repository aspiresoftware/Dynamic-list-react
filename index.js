
var React = require('react');
var ReactDom = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var $ = require('jquery');
var AppBar = require('material-ui/lib/app-bar');
var TextField = require('material-ui/lib/text-field');
var FlatButton = require('material-ui/lib/flat-button');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var ListDivider = require('material-ui/lib/lists/list-divider');
var Colors = require('material-ui/lib/styles/colors');
var Avatar = require('material-ui/lib/avatar');
var Card = require('material-ui/lib/card/card');
var CardMedia = require('material-ui/lib/card/card-media');
var CardTitle = require('material-ui/lib/card/card-title');
var CardActions = require('material-ui/lib/card/card-actions');
var CardText = require('material-ui/lib/card/card-text');

var LeftMenu = React.createClass({
	render:function(){
		return null;
	}
})

/**
 * Load the list containing the title and poster image
 * Check if Response property in movielist(Response from query request) is true;
 * that means movie name present with searched text
 * Otherwise it will show message 'List not available'
 */
var MovieList = React.createClass({

	render:function() {
		var styleimage= {
			width:100,
			height:100,
			display:'block'
		};
		var noPadding = {
			padding:0,
			margin:0
		};
		var that = this;
		var key=0;
		return <List>		
		<ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={1000} >	
		{that.props.movielist.Response?<h3>Can not find movie name with searched text</h3>:that.props.movielist.Search.map(function(item,index,arr){
				//	calling the onclick method passed through properties, for more detail see https://facebook.github.io/react/docs/transferring-props.html
				//	if got poster detail as NA then show local image. 
				return 	<ListItem key={item.imdbID+key++} onClick={that.props.onclick.bind(null,item.imdbID)}
				leftAvatar={<Avatar src={item.Poster !== that.props.imageNA?item.Poster:that.props.noImageUrl} />}
				primaryText={item.Title} secondaryText={
					<p>
					<span style={{color: Colors.darkBlack}}>Type: {item.Type} <br/>
					Year: {item.Year}</span>
					</p>
				}
				secondaryTextLines={2} >
				</ListItem>
			})}
		</ReactCSSTransitionGroup>
			</List>
		
	}
});

/**
 * Render the full detail of movie when click on list item
 */
var SearchDetail = React.createClass({
	render:function(){
		var movieDetail = this.props.movieDetail;
		//Using the feature of css in jsx, for more info see https://facebook.github.io/react/tips/inline-styles.html
		var styleimage= {
			width:400,
			height:400,
			display:'block'
		};
		return <Card>
		<CardMedia overlay={<CardTitle title={movieDetail.Title || "Title"} subtitle={"Imdb Rating: "+(movieDetail.imdbRating || "")}/>}>
    <img style={styleimage} src={movieDetail.Poster !== this.props.imageNA?movieDetail.Poster:this.props.noImageUrl}/>
	  </CardMedia>
		<List>
		<ListItem primaryText={"Released: "+(movieDetail.Released || " ")} />
		<ListItem primaryText={"Genre: "+(movieDetail.Genre || " ")} />
		<ListItem primaryText={"Awards: "+(movieDetail.Awards || " ")} />
		<ListItem primaryText={"Country: "+(movieDetail.Country || " ")} />
		<ListItem primaryText={"Director: "+(movieDetail.Director || " ")} />
		<ListItem primaryText={"Actors: "+(movieDetail.Actors || " ")} />
		<ListItem primaryText={"Writer: "+(movieDetail.Writer || " ")} />
		<ListItem primaryText={"Plot: "+(movieDetail.Plot || " ")} />
		</List>
		</Card>
	}
})
/**
 * Main React component that load other React component List,SearchDetail
 * 
 */
var SearchMovies = React.createClass({
	render:function () {
		//given 50% width to each block, one is showing list that is searched and
		//other onw showing movie detail which clicked on list item
		var divstyle1 = {
			width:'40%',
			height:'auto',
			display:'inline-block'
		};
		var divstyle2 = {
			width:'40%',
			height:'auto',
			display:'inline-block'
		};
		var absoultePos = {
			position:'absolute'
		}
		absoultePos = $.extend({},divstyle2,absoultePos);
		var noImageUrl = 'images/noImageAvailable.jpg';
		var imageNA = 'N/A';
		return <div>
		<AppBar
  title="Imdb Search Movie"
  iconElementLeft={<LeftMenu/>} />
				 <form onSubmit={this.searchMovie} action="#">
					<TextField  hintText="Search Movie Title"  onChange={this.handleChange}/>
					<FlatButton label="Search" onClick={this.searchMovie} primary={true} />
				</form>
				<div style={divstyle1}>
				<MovieList movielist={this.state.list} onclick={this.getMovieDetail} noImageUrl={noImageUrl} imageNA={imageNA}/>
				</div>
				<div style={divstyle2,absoultePos}>
				<SearchDetail movieDetail={this.state.movieDetail} noImageUrl={noImageUrl} imageNA={imageNA}/>
				</div>
				</div>
	},
	getInitialState:function() {
		return {
			searchTerm:'',
			/*
			Initially set property for list such can use in List react-component(see http://stackoverflow.com/questions/24706267/cannot-read-property-map-of-undefined)
			 */
			list:{'Search':[],Response:false},
			searchUrl:'http://www.omdbapi.com/?s=',
			searchUrlById:'http://www.omdbapi.com/?i=',
			movieDetail:[]
		}
	},
	searchMovie:function(event) {
		//store the this variable, such that can use in $.get method()
		var that = this;
		var searchTerm = this.state.searchTerm;
		//Replace the space character in search url with plus sign
		searchTerm = searchTerm.trim();
		if(searchTerm === '') return;
		searchTerm = searchTerm.replace(/ /g,'+');
		var searchUrl = that.state.searchUrl;
		$.get(searchUrl+searchTerm,function(data) {
			that.setState({
				list:data
			})
		})
		return false;
	},
	handleChange:function(event) {
		var that = this;
		this.setState({
			searchTerm:event.target.value
		},function(){
		/**
		 * Comment following line if you do not want instant Search,
		 * added callback that will eecuted after state has been set for more info see https://groups.google.com/forum/#!msg/reactjs/R61kPjs-yXE/bk5AGv78RYAJ
		 */
		that.searchMovie(event);
		});
	},
	getMovieDetail:function(data) {
		//To prevent page refresh when press the enter key
		event.preventDefault();
		var that = this;
		var searchTerm = data;
		var searchUrlById = that.state.searchUrlById;
		$.get(searchUrlById+searchTerm,function(data) {
			that.setState({
				movieDetail:data
			})
		})
	}

});
ReactDom.render(<SearchMovies />,document.getElementById('imdb-search'));