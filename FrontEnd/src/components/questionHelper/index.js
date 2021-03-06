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
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ToolTip from 'rc-tooltip';

/**
 * Question mark icon with a tooltip on hover
 */
class QuestionHelper extends Component {
  constructor(props) {
    super(props);
    let { elaboration } = props;
    const shortCutDict = {
      cve: 'Common Vulnerabilities and Exposures',
      cpe: 'Common Platform Enumeration',
      cwe: 'Common Weakness Enummeration - is a community-developed list of common software and hardware security weaknesses.',
      capec: 'The Common Attack Pattern Enumeration and Classification - catalog of common attack patterns',
      cvss: 'Common Vulnerability Scoring System - assessing the severity of computer system security vulnerabilities.',
    };

    const shortCutPrefix = 'shortcut_';
    if (this.props.elaboration.startsWith(shortCutPrefix)) {
      const shortcutId = this.props.elaboration.slice(shortCutPrefix.length);
      if (shortcutId in shortCutDict) {
        elaboration = shortCutDict[shortcutId];
      }
    } else {
      elaboration = this.props.elaboration;
    }

    this.state = {
      elaboration,
    };
  }

  render() {
    return (
      <>
        {this.props.children}
        <ToolTip placement="top" overlay={this.state.elaboration}>
          <FontAwesomeIcon className="ml-1" icon={faQuestionCircle} />
        </ToolTip>
      </>
    );
  }
}

QuestionHelper.propTypes = {
  /** corresponding text */
  children: PropTypes.node.isRequired,
  /** lookup string for content of the tooltip */
  elaboration: PropTypes.node.isRequired,
};

export default QuestionHelper;
