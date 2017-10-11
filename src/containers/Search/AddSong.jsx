// react & redux
import React from 'react';
import { connect } from 'react-redux';
import { onSearch } from '../../actions/searchAction';
import { bindActionCreators } from 'redux';
import { getSongs } from '../../actions/playlistActions';
// api
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import Login from '../../components/Accounts/Login.jsx';
import AddSongEntry from '../../components/Search/AddSongEntry.jsx';
// styled-components
import styled from 'styled-components';

const SearchResult = styled.div`
  background: #fff;
  font-size: 13px;
  height: 300px;
  width: 563px;
  position: fixed;
  z-index: 200;
  overflow: scroll;
  border-radius: 2px;
  top: 52px;
  right: 295px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
`;

const Input = styled.input`
  padding: 8px;
  margin: 8px;
  color: #363636;
  background: #fff;
  border: none;
  border-radius: 2px;
  width: 200px;
`;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      users: [],
      currentUser: '',
      usersSongs: []
    };
    this.onAdd = this.onAdd.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
  }

  componentDidMount() {
    this.getAllUsers();
  }

  onAdd(song) {
    let newSong = {};
    newSong.name = song.name;
    newSong.image = song.album.images[1].url;
    newSong.link = song.external_urls.spotify;
    newSong.artist = song.artists[0].name;
    if (this.state.currentUser === '') {
      newSong.userName = 'anonymous';
    } else {
      newSong.userName = this.state.currentUser.name;
    }
    axios
      .post(`${window.server}/songs`, newSong)
      .then(response => {
        // window.location.href = `${window.server}/hostLogin`;
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleUserChange(user) {
    this.setState({
      currentUser: user
    });
    if (user.addedSongs.length > 0) {
      this.setState({ usersSongs: user.addedSongs });
    }
  }

  getAllUsers() {
    axios
      .get(`${window.server}/users`)
      .then(response => {
        this.setState({
          users: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const styles = {
      inside: {
        width: '30%',
        display: 'inline-block'
      },
      textAlign: 'center',
      width: '100%',
      height: '100%'
    };
    return (
      <div>
        <Input
          placeholder="Search Songs"
          onChange={e => this.props.dispatch(onSearch(e).bind(this))}
        />
        {this.props.results && this.state.query ? (
          <SearchResult>
            {this.props.results &&
              this.props.results.map((result, i) => {
                return (
                  <AddSongEntry key={i} onAdd={this.onAdd} Result={result} />
                );
              })}
          </SearchResult>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    results: state.searchReducer.results
  };
};

export default connect(mapStateToProps, null)(Search);
