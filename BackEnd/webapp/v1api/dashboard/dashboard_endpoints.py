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
from database.debian.packages import parse_datetime
from webapp import app, db
from flask import jsonify
from database.dashboard.dashboard import (
    get_cves_over_time_cached,
    get_cve_count_over_time_cached
)


@app.route("/api/v1/dashboard/cves/<string:time_from>/"
           "<string:time_to>/<string:freq>", methods=['GET'])
def ep_get_cves_over_time(time_from, time_to, freq):
    t_from = parse_datetime(time_from)
    t_to = parse_datetime(time_to)
    labels, grouped_cves = get_cves_over_time_cached(t_from, t_to, freq)

    resp = {
        "labels": labels,
        "cves": grouped_cves
    }

    return jsonify(resp)


@app.route("/api/v1/dashboard/cves/count/<string:time_from>/"
           "<string:time_to>/<string:freq>", methods=['GET'])
def ep_get_cves_over_time_count(time_from, time_to, freq):
    t_from = parse_datetime(time_from)
    t_to = parse_datetime(time_to)

    labels, cves = get_cve_count_over_time_cached(t_from, t_to, freq)

    resp = {
        "labels": labels,
        "cves_count": cves
    }

    return jsonify(resp)


@app.route("/api/v1/dashboard/cves/lang/<string:language>",
           methods=["GET"])
def get_cve_count_by_language(language):
    cves = db.database.cvedb.cves
    dlas = db.database.debian.dlas
    dsas = db.database.debian.dsas
    packages = db.database.debian.packages

    pkgs_by_lang = packages.aggregate([
        {
            "$match":
                {
                    "versions.sloc." + language: {"$gte": 0}
                }
        },
        {
            "$project":
                {
                    "_id": 1,
                    "pkg_name": 1
                }
        }])

    pkg_names = [pkg["pkg_name"] for pkg in pkgs_by_lang]

    dsa_refs = dlas.find(filter={"packages": {"$in": pkg_names}},
                         projection={"_id": 1, "secrefs": 1})
    dla_refs = dsas.find(filter={"packages": {"$in": pkg_names}},
                         projection={"_id": 1, "secrefs": 1})

    all_refs = []
    for x in dsa_refs:
        if x["secrefs"] is not None:
            all_refs += x["secrefs"].split(" ")
    for x in dla_refs:
        if x["secrefs"] is not None:
            all_refs += x["secrefs"].split(" ")

    result = cves.find(filter={"id": {"$in": all_refs}})

    resp = {
        "count": result.count()
    }

    return jsonify(resp)