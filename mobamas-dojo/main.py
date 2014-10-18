#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import csv
import urllib2
import jinja2
import codecs
from datetime import datetime
import operator
import argparse

APP_PATH = os.path.dirname(__file__)
TEMPLATE = 'template.html'
OUTPUT_RANK = 'index.html'
OUTPUT_RANK_PATH = os.path.join(APP_PATH, OUTPUT_RANK)
OUTPUT_LV = 'lv.html'
OUTPUT_LV_PATH = os.path.join(APP_PATH, OUTPUT_LV)
NUMBER_OF_DOJOS = 1000

class Dojo:
    def __init__(self, lv, rank, id, leader, defense):
        self.lv = lv
        self.rank = rank
        self.id = id
        self.leader = leader
        self.defense = defense

def unicode_csv_reader(utf8_csv_data, dialect=csv.excel, **kwargs):
    reader = csv.reader(utf8_csv_data, dialect=dialect, **kwargs)
    for row in reader:
        yield [unicode(cell, 'utf-8') for cell in row]

def format_datetime(value):
    return value.strftime('%Y-%m-%d %H:%M')

def write_html(template, template_values, output_path):
    jinja = jinja2.Environment(loader=jinja2.FileSystemLoader(APP_PATH))
    jinja.filters['datetime'] = format_datetime
    template = jinja.get_template(template)

    try:
        output = template.render(template_values)
    except jinja2.TemplateError, e:
        print e.reason
        sys.exit()

    f = codecs.open(output_path, 'w', 'utf-8')
    try:
        f.write(output)
    finally:
        f.close()

parser = argparse.ArgumentParser(description='Generate Mobamas Dojo HTML.')
parser.add_argument('-d', '--debug', action='store_true', help='flag of debug mode')
args = parser.parse_args()

url = 'https://spreadsheets.google.com/pub?key=0Aq6mv2GCHMGLdERhLURsdEZwdVFvREdiYjE4Sy1FUnc&output=csv'

print '---- urlopen ----'

try:
    result = urllib2.urlopen(url)
except urllib2.URLError, e:
    print e.reason
    sys.exit()

dojos = []

print '---- unicode_csv_reader ----'

reader = unicode_csv_reader(result)
headers = reader.next()
for unused, lv, rank, id, type, link, cheer, leader, defense, comment, no, lastUpdate, repeated in reader:
    if lv != '' and rank != '' and id != '' and repeated != u'重複':
        dojos.append(Dojo(int(lv), rank.replace('.', ''), id, leader, defense))

print '---- dojos_rank ----'

dojos_rank = dojos[:NUMBER_OF_DOJOS]

for i, dojo in enumerate(dojos_rank):
    print str(i) + ': ' + str(dojo.lv) + ', ' + dojo.rank + ', ' + dojo.id + ', ' + dojo.leader

template_values = {
    'dojos': dojos_rank,
    'now': datetime.now(),
    'type': 'rank',
    'debug': args.debug
}
write_html(TEMPLATE, template_values, OUTPUT_RANK_PATH)

print '---- dojos_lv ----'

dojos.sort(key=operator.attrgetter('lv'), reverse=True)

dojos_lv = dojos[:NUMBER_OF_DOJOS]

for i, dojo in enumerate(dojos_lv):
    print str(i) + ': ' + str(dojo.lv) + ', ' + dojo.rank + ', ' + dojo.id + ', ' + dojo.leader

template_values = {
    'dojos': dojos_lv,
    'now': datetime.now(),
    'type': 'lv',
    'debug': args.debug
}
write_html(TEMPLATE, template_values, OUTPUT_LV_PATH)
