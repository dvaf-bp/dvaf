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
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

/**
 * Navigation Entry in the sidebar
 */
const Entry = props => {
  return (
    <li className="nav-item">
      <NavLink to={props.to} exact={props.exact} activeClassName="active" className="nav-link">
        <FontAwesomeIcon className="mr-2" icon={['fas', props.icon]} />
        {props.children}
      </NavLink>
    </li>
  );
};

Entry.propTypes = {
  /** If true, the entry link must match exactly the url to be active */
  exact: PropTypes.bool,
  /** Text */
  children: PropTypes.node.isRequired,
  /** Link */
  to: PropTypes.string.isRequired,
  /** Icon */
  icon: PropTypes.string.isRequired,
};

Entry.defaultProps = {
  exact: false,
};

export default Entry;
