'use client';

import React, { useState } from 'react';

import type { PaperFormat } from 'puppeteer';

import { Plate } from '@udecode/plate/react';
import { ChevronDownIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { Button } from '@/registry/default/potion-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/default/potion-ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/registry/default/potion-ui/dropdown-menu';
import { Editor, EditorContainer } from '@/registry/default/potion-ui/editor';
import { Input } from '@/registry/default/potion-ui/input';

import { useCreateEditor } from '../components/editor/use-create-editor';
import { useCreatePrintEditor } from '../components/editor/use-create-print-editor';
import { downloadFile } from '../lib/download-file';
import { Spinner } from '../potion-ui/spinner';
import { exportValue } from './export-value';

export default function ExportDemo() {
  const searchParams = useSearchParams();
  const disableMedia = searchParams.get('disableMedia') === 'true';
  const print = searchParams.get('print') === 'true';

  const printEditor = useCreatePrintEditor(
    {
      disableMedia: disableMedia,
      value: exportValue,
    },
    [exportValue]
  );

  const defaultEditor = useCreateEditor({
    value: exportValue,
  });

  const editor = print ? printEditor : defaultEditor;

  return (
    <Plate readOnly={print} editor={editor}>
      {!print && <ExportDialog className="absolute top-10 right-10 z-10" />}

      <EditorContainer variant={print ? 'default' : 'demo'}>
        <Editor variant={print ? 'default' : 'demo'} />
      </EditorContainer>
    </Plate>
  );
}

export function ExportDialog({ className }: { className?: string }) {
  const [type, setType] = useState('pdf');
  const [pageFormat, setPageFormat] = useState<PaperFormat>('a4');
  const [scale, setScale] = useState('100');
  const [isExporting, setIsExporting] = useState(false);
  const [disableMedia, setDisableMedia] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch('/api/export/pdf', {
        body: JSON.stringify({
          disableMedia,
          format: pageFormat,
          scale: Number(scale) / 100,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();

        throw new Error(error.message || 'Export failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      // Replace with the document name
      await downloadFile(url, 'export-demo');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand" className={className}>
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
          <DialogDescription>Choose your export preferences</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="format">Export format</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-auto w-fit justify-between"
                >
                  {type.toUpperCase()}
                  <ChevronDownIcon className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-32 py-1">
                <DropdownMenuItem onClick={() => setType('pdf')}>
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem disabled onClick={() => setType('html')}>
                  HTML
                  <DropdownMenuShortcut>soon</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem disabled onClick={() => setType('markdown')}>
                  Markdown
                  <DropdownMenuShortcut>soon</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="format">Include content</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-auto w-fit justify-between"
                >
                  {disableMedia ? 'No files or images' : 'Everything'}
                  <ChevronDownIcon className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-32 py-1">
                <DropdownMenuItem onClick={() => setDisableMedia(false)}>
                  Everything
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDisableMedia(true)}>
                  No files or images
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="format">Page format</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-auto w-fit justify-between"
                >
                  {pageFormat.charAt(0).toUpperCase() +
                    pageFormat.slice(1).toLowerCase()}
                  <ChevronDownIcon className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-32 py-1">
                <DropdownMenuItem onClick={() => setPageFormat('a4')}>
                  A4
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPageFormat('a3')}>
                  A3
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPageFormat('letter')}>
                  Letter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPageFormat('legal')}>
                  Legal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPageFormat('tabloid')}>
                  Tabloid
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Label htmlFor="scale">Scale (%)</Label>
              <Input
                id="scale"
                className="ml-auto w-16 rounded-md border px-2 py-1 text-center"
                value={scale}
                onChange={handleScaleChange}
              />
            </div>
            {(Number(scale) < 10 || Number(scale) > 200) && (
              <span className="text-sm text-red-500">
                Scale percent must be a number between 10 and 200
              </span>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="brand" disabled={isExporting} onClick={handleExport}>
            {isExporting ? (
              <>
                <Spinner className="mr-2 size-4 animate-spin" />
                Exporting...
              </>
            ) : (
              'Export file'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
