"""
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
"""
from flask import jsonify
from webapp import app
from flask import request
from database.cve.cve import get_cves_by_ids, get_cwe_by_ids
from database.cve.browse_cves import get_similar_cves_by_id


@app.route("/api/v1/cves/info", methods=["POST"])
def ep_get_cves_information():
    """
    This endpoint receives a list of CVE ids in the following form
    .. code-block::

        {
            "cves": ["CVE-1234-5678", "CVE-0000-1111", ...]
        }

    and returns all CVE and CWE information in the following form
    .. code-block::

        {
            "cves": {
                "CVE-1234-5678": {
                    ...
                },
                "CVE-0000-1111": {
                    ...
                },
                ...
            },
            "cwes": {
                "101": {
                    ...
                },
                "403": {
                    ...
                },
                ...
            }
        }

    Args:
        URL: */api/v1/cves/info*
        CVE ids: As a JSON string in the request body.

    Returns:
        str: The CVE's and CWE's as a JSON string.
    """
    js = request.json
    cve_ids = js["cves"]

    cves = get_cves_by_ids(cve_ids)
    cwe_ids = set()

    for cve in cves.values():
        if "cwe" in cve:
            parts = cve["cwe"].split("-")

            if len(parts) <= 1:
                continue

            cwe_id = parts[1]
            # replace it with correct format
            cve["cwe"] = cwe_id
            cwe_ids.add(cwe_id)

    cwes = get_cwe_by_ids(list(cwe_ids))

    resp = {
        "cves": cves,
        "cwes": cwes
    }

    return jsonify(resp)


@app.route("/api/v1/cves/match/<string:partial_id>", methods=["GET"])
def ep_get_similary_cves_by_id(partial_id):
    """
    This endpoint receives a partial CVE is such as "CVE-2015-" and
    returns a list of similar CVE ids.
    .. code-block::

        {
            "cves": ["CVE-2015-0001", "CVE-2015-0002", ...]
        }

    Args:
        URL: */api/v1/cves/match*
        partial_id: The CVE id.

    Returns:
        str: The list of CVE's as a JSON string.
    """
    cves = get_similar_cves_by_id(partial_id, 100)

    resp = {
        "cves": cves
    }

    return jsonify(resp)