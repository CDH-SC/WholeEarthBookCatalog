import os.path
import glob
import time
import subprocess

dirs = ["/backup/data/viaf_data/transfer/viaf-split-{}".format(x) for x in range(0,5)]
tsvs = ["/backup/data/viaf_data/transfer/viaf-out-{}.tsv".format(x) for x in range(0,5)]

FULL_SPLIT = "/backup/data/viaf_data/uncompressed/viaf-full-split"
FULL_TSV = "/backup/data/viaf_data/uncompressed/viaf-out-full.tsv"

COMPRESSED_FULL_SPLIT = "/backup/data/viaf_data/compressed/viaf-full-split.tar.gz"
COMPRESSED_FULL_TSV = "/backup/data/viaf_data/compressed/viaf-out-full.tsv.gz"

THIRTY_K_SPLIT = "/backup/data/viaf_data/uncompressed/viaf-30k-split"
THIRTY_K_TSV = "/backup/data/viaf_data/uncompressed/viaf-out-30k.tsv"

COMPRESSED_THIRTY_K_SPLIT = "/backup/data/viaf_data/compressed/viaf-30k-split.tar.gz"
COMPRESSED_THIRTY_K_TSV = "/backup/data/viaf_data/compressed/viaf-out-30k.tsv.gz"

THREE_MIL_SPLIT = "/backup/data/viaf_data/uncompressed/viaf-3mil-split"
THREE_MIL_TSV = "/backup/data/viaf_data/uncompressed/viaf-out-3mil.tsv"

COMPRESSED_THREE_MIL_SPLIT = "/backup/data/viaf_data/compressed/viaf-3mil-split.tar.gz"
COMPRESSED_THREE_MIL_TSV = "/backup/data/viaf_data/compressed/viaf-out-3mil.tsv.gz"

SPLIT_SIZES = [None, 30000, 3000000]
SPLITS = [FULL_SPLIT, THIRTY_K_SPLIT, THREE_MIL_SPLIT]
COMPRESSED_SPLITS = [COMPRESSED_FULL_SPLIT, COMPRESSED_THIRTY_K_SPLIT, COMPRESSED_THREE_MIL_SPLIT]

TSVS_OUT = [FULL_TSV, THIRTY_K_TSV, THREE_MIL_TSV]
COMPRESSED_TSVS_OUT = [COMPRESSED_FULL_TSV, COMPRESSED_THIRTY_K_TSV, COMPRESSED_THREE_MIL_TSV]

def handleErr(proc=None, fname=None):
    if fname:
        print(fname)
    _,err = proc.communicate()
    print(err.decode('utf-8'))
    exit(1)

for splt, tsv in zip(SPLITS, TSVS_OUT):

    if os.path.isdir(splt):
        p1 = subprocess.Popen(["rm", "-fr", splt], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        p1.wait()
        res1 = p1.returncode

    else:
        res1 = 0

    if res1 == 0:

        if os.path.isfile(tsv):
            p2 = subprocess.Popen(["rm",  tsv], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            p2.wait()
            res2 = p2.returncode 

        else:
            res2 = 0

        if res2 == 0:

            p3 = subprocess.Popen(["touch", tsv], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            p3.wait()

            if p3.returncode != 0:
                handleErr(p3)

            p4 = subprocess.Popen(["mkdir", splt], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            p4.wait()
            
            if p4.returncode != 0:
                handleErr(p4)

        else:
            handleErr(p2)
    else:
        handleErr(p1)

open_procs = []
flocks = {}
transferred = []
readp = []

while dirs or tsvs or open_procs:

    for index, ps in enumerate(open_procs):
        resource, curr = ps
        if curr.poll() != None:
            if curr.returncode != 0:
                handleErr(curr)
            else:
                del open_procs[index]
                flocks[resource] = False

    for index, dname in enumerate(dirs):
        dir_globs = glob.glob("{}/.*".format(dname))        
        if not dir_globs and os.path.isdir(dname):
            transferred.append(dname)
            del dirs[index]

    for index,dname in enumerate(transferred):
        for fname in glob.glob("{}/*".format(dname)):
            f_ext = fname.split("/")[-1]
            flock = flocks.get(f_ext, None)
            if flock == None or flock == False and fname not in readp:
                print("HERE WITH {} {}".format(fname, f_ext))
                readp.append(fname)
                open_procs.append([f_ext, subprocess.Popen("cat {} >> {}/{}".format(fname, FULL_SPLIT, f_ext), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)])
                flocks[f_ext] = True


    tsv_globs = ["".join(x.partition(".tsv")[0:2]) for x in glob.glob("/backup/data/viaf_data/transfer/viaf-out-*.tsv.*")]
    for index, fname in enumerate(tsvs):
        if fname not in tsv_globs and os.path.isfile(fname):
            flock = flocks.get(FULL_TSV, None)
            if flock == False or flock == None:
                open_procs.append([FULL_TSV, subprocess.Popen("cat {} >> {}".format(fname,FULL_TSV), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)])
                flocks[FULL_TSV] = True
                del tsvs[index]

    time.sleep(2)


                    
for splt, c_splt, tsv, c_tsv, splt_size in zip(SPLITS, COMPRESSED_SPLITS, TSVS_OUT, COMPRESSED_TSVS_OUT, SPLIT_SIZES):
    if splt_size != None:
        for fname in glob.glob("{}/*".format(FULL_SPLIT)):
            curr = subprocess.Popen("head -n {}, {} >> {}/{}".format(splt_size, fname, splt, fname), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            curr.wait()
            if curr.returncode != 0:
                handleErr(curr)
        curr = subprocess.Popen("head -n {} {} >> {}".format(splt_size, FULL_TSV, tsv), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        curr.wait()
        if curr.returncode != 0:
            handleErr(curr)

    p1 = subprocess.Popen(["tar","zkcvf", c_splt, splt])
    p2 = subprocess.Popen("gzip -c {} > {}".format(tsv, c_tsv), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    p1.wait()
    p2.wait()

    if p1.returncode != 0:
        handleErr(p1)
    if p2.returncode != 0:
        handleErr(p2)

    

