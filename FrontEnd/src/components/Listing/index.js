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
import { Link } from 'react-router-dom';
import './listing.scss';

/**
 * Expandable list of items. If the list is longer than 3 items, there's a more button allowing to view all the entries.
 */
class Listing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.update = this.update.bind(this);
  }

  update() {
    this.setState(prev => ({ expanded: !prev.expanded }));
  }

  render() {
    let button;
    if (this.state.expanded)
      button = (
        <button type="button" onClick={this.update} className="btn btn-sm text-secondary">
          less <FontAwesomeIcon icon={['fas', 'caret-up']} />
        </button>
      );
    else
      button = (
        <button type="button" onClick={this.update} className="btn btn-sm text-secondary is-closed">
          more <FontAwesomeIcon icon={['fas', 'caret-down']} />
        </button>
      );

    let deps = this.props.list;

    if (deps === null) {
      return (
        <div className="alert alert-primary" role="alert">
          {this.props.emptyMessage}
        </div>
      );
    }

    deps = deps.filter((e, i) => deps.indexOf(e) === i && e !== '');

    return (
      <div className="listing">
        <div className={`list-group ${this.state.expanded && 'full-h'}`}>
          {deps.sort().map(dep => (
            <Link key={dep} to={`/package/${dep.split(' ')[0]}`} className="list-group-item list-group-item-action">
              <div className="media">
                <div className="media-body">{dep}</div>
              </div>
            </Link>
          ))}
          {deps.length > 3 ? button : ''}
        </div>
      </div>
    );
  }
}

Listing.propTypes = {
  /** List of nodes to be displayed */
  list: PropTypes.arrayOf(PropTypes.node),
  /** Message displayed if list is empty */
  emptyMessage: PropTypes.string.isRequired,
};

Listing.defaultProps = {
  list: [],
};

export default Listing;
