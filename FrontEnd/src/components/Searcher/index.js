/*
DVAF -  offers the security-research community with up-to-date information
        about vulnerability trends, types, etc.

Copyright (C) 2019-2020
Nikolaos Alexopoulos <alexopoulos@tk.tu-darmstadt.de>,
Lukas Hildebrand <lukas.hildebrand@stud.tu-darmstadt.de>,
Jörn Schöndube <joe.sch@protonmail.com>,
Tim Lange <tim.lange@stud.tu-darmstadt.de>,
Moritz Wirth <mw@flanga.io>,
Paul-David Zürcher <mail@pauldavidzuercher.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import ScoreCircle from '../ScoreCircle';
import { BASE_URL } from '../../constants';

class Searcher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: [],
      show: 10,
    };

    this.timeout = null;
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
        this.setState(prev => ({
          show: prev.show + 10,
        }));
      }
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get('query') || '';
    if (query !== '') this.setState({ query }, this.query);
  }

  setParams(query) {
    const searchParams = new URLSearchParams();
    searchParams.set('query', query);
    this.props.history.push(`?${searchParams.toString()}`);
  }

  search(e) {
    clearTimeout(this.timeout);

    this.setState({ query: e.target.value }, this.query);
  }

  query() {
    this.timeout = setTimeout(() => {
      const value = this.state.query;

      this.setParams(value);

      if (value === '') {
        this.setState({ results: [] });
        return;
      }
      if (value.length < 3) return;

      fetch(`${BASE_URL}/api/v1/packages/match/${value}`)
        .then(response => response.json())
        .then(data => {
          this.setState({ results: data });
        })
        .catch(err => console.error(err));
    }, 250);
  }

  render() {
    return (
      <>
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search for package..."
            value={this.state.query}
            onChange={this.search}
          />
        </div>
        <h2 className="pt-3">Results</h2>
        <div className="container-fluid">
          {this.state.results.slice(0, this.state.show).map(result => (
            <div key={result.name} className="card mb-2">
              <div className="card-body d-flex align-items-center justify-content-between">
                <NavLink to={`/package/${result.name}`}>
                  <h4 className="card-title">{result.name}</h4>
                  {result.aliases.length > 1 ? (
                    <p className="card-text text-secondary">
                      also known as{' '}
                      {result.aliases
                        .slice(1)
                        .join(', ')
                        .substring(-2)}
                    </p>
                  ) : (
                    ''
                  )}
                </NavLink>
                <div className="text-center">
                  Highest Severity:
                  <ScoreCircle number={result.highest_affecting_cvss} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

Searcher.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default Searcher;